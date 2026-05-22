import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { DebateMessage } from '../store/useGameStore';
import { generateCassandraResponse } from '../services/llmService';
import { generateFelixResponse, evaluateJudgeBalance, generateJudgeEdict } from '../services/geminiService';
import { getRealWorldContext } from '../services/searchService';

export const useDebateOrchestrator = (
  setStatusMessage: (msg: string | null) => void,
  userHandle: string
) => {
  const store = useGameStore();

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const processTurn = useCallback(async (playerInput: string, usePlayerSearch: boolean) => {
    const { settings, searchQuotas, currentEdict, turnCount, maxRounds, cassandraSideSwitched, felixConviction } = useGameStore.getState();

    // End-of-game safety check
    if (turnCount > maxRounds) {
      setStatusMessage('ВЫПУСК ГАЗЕТЫ ЗАВЕРШЕН. ДЕБАТЫ ЗАКРЫТЫ.');
      return;
    }

    // ==========================================
    // 1. FRANK (PLAYER) TURN
    // ==========================================
    store.setActiveSpeaker('frank');
    setStatusMessage('ВЕРСТКА ВАШЕГО ТЕЗИСА...');
    
    let playerSearchContext = '';
    if (usePlayerSearch && searchQuotas.frank > 0) {
      store.decrementSearchQuota('frank');
      playerSearchContext = await getRealWorldContext(userHandle);
      console.log('Player search context for prompt context matching:', playerSearchContext);
    }

    const playerMsg: DebateMessage = { 
      id: generateId(), 
      role: 'frank', 
      content: playerInput,
      isSearchActive: usePlayerSearch 
    };
    store.addMessage(playerMsg);

    // Judge evaluates Player
    setStatusMessage('СУДЬЯ СОЛОМОН АНАЛИЗИРУЕТ ВАШ ХОД...');
    const playerEval = await evaluateJudgeBalance('frank', playerInput, currentEdict, usePlayerSearch);
    store.updateMessageEval(playerMsg.id, playerEval);

    // Player logical argument reduces Cassandra's stubbornness
    if (!cassandraSideSwitched && (playerEval.x > 0.1 || playerEval.z > 0.1)) {
      const reduction = Math.max(1, Math.round((Math.max(0, playerEval.x) + Math.max(0, playerEval.z)) * 8));
      store.setCassandraConviction((c) => {
        const nextVal = c - reduction;
        if (nextVal <= 0) {
          store.setCassandraSideSwitched(true);
          return 0;
        }
        return nextVal;
      });
    }

    // ==========================================
    // 2. FELIX (ADVOCATE) TURN
    // ==========================================
    store.setActiveSpeaker('felix');
    setStatusMessage('ДОКТОР ФЕЛИКС ПОДБИРАЕТ ОПРАВДАНИЯ...');
    
    // Felix decides to use search if quota is available
    const useFelixSearch = searchQuotas.felix > 0 && (Math.random() > 0.4 || settings.deepResearch.felix);
    if (useFelixSearch) store.decrementSearchQuota('felix');

    let felixSearchContext = undefined;
    if (useFelixSearch) {
      setStatusMessage('ФЕЛИКС ИЩЕТ ПОДТВЕРЖДЕНИЯ В СЕТИ...');
      felixSearchContext = await getRealWorldContext(userHandle);
    }

    const historyAfterPlayer = useGameStore.getState().debateLog;
    const isFelixSwitched = felixConviction <= 0;

    const felixContent = await generateFelixResponse(
      historyAfterPlayer,
      currentEdict,
      settings.injections.felix,
      isFelixSwitched,
      felixSearchContext
    );

    const felixMsg: DebateMessage = { 
      id: generateId(), 
      role: 'felix', 
      content: felixContent,
      isSearchActive: useFelixSearch 
    };
    store.addMessage(felixMsg);

    // Judge evaluates Felix
    setStatusMessage('СУДЬЯ СОЛОМОН АНАЛИЗИРУЕТ АДВОКАТА...');
    const felixEval = await evaluateJudgeBalance('felix', felixContent, currentEdict, useFelixSearch);
    store.updateMessageEval(felixMsg.id, felixEval);

    // Felix logical arguments reduce Cassandra's stubbornness
    const currentCassandraSwitched = useGameStore.getState().cassandraSideSwitched;
    if (!currentCassandraSwitched && !isFelixSwitched && (felixEval.x > 0.1 || felixEval.z > 0.1)) {
      const reduction = Math.max(1, Math.round((Math.max(0, felixEval.x) + Math.max(0, felixEval.z)) * 6));
      store.setCassandraConviction((c) => {
        const nextVal = c - reduction;
        if (nextVal <= 0) {
          store.setCassandraSideSwitched(true);
          return 0;
        }
        return nextVal;
      });
    }

    // ==========================================
    // 3. CASSANDRA (OPPONENT) TURN
    // ==========================================
    store.setActiveSpeaker('cassandra');
    setStatusMessage('КАССАНДРА ГОТОВИТ ОТВЕТНЫЙ УДАР...');

    const useCassandraSearch = searchQuotas.cassandra > 0 && (Math.random() > 0.4 || settings.deepResearch.cassandra);
    if (useCassandraSearch) store.decrementSearchQuota('cassandra');

    const historyAfterFelix = useGameStore.getState().debateLog;
    const latestCassandraSwitched = useGameStore.getState().cassandraSideSwitched;

    const cassandraContent = await generateCassandraResponse(
      historyAfterFelix,
      currentEdict,
      useCassandraSearch,
      settings.injections.cassandra,
      latestCassandraSwitched,
      setStatusMessage,
      userHandle
    );

    const cassandraMsg: DebateMessage = { 
      id: generateId(), 
      role: 'cassandra', 
      content: cassandraContent,
      isSearchActive: useCassandraSearch
    };
    store.addMessage(cassandraMsg);

    // Judge evaluates Cassandra
    setStatusMessage('СУДЬЯ СОЛОМОН ОЦЕНИВАЕТ КАССАНДРУ...');
    const cassandraEval = await evaluateJudgeBalance('cassandra', cassandraContent, currentEdict, useCassandraSearch);
    store.updateMessageEval(cassandraMsg.id, cassandraEval);

    // Cassandra's logic attacks Felix's conviction (stubbornness of player's defense)
    if (!latestCassandraSwitched && !isFelixSwitched && (cassandraEval.x > 0.1 || cassandraEval.z > 0.1)) {
      const reduction = Math.max(1, Math.round((Math.max(0, cassandraEval.x) + Math.max(0, cassandraEval.z)) * 7));
      store.setFelixConviction((c) => Math.max(0, c - reduction));
    }

    // ==========================================
    // 4. JUDGE ROUND RE-EVALUATION / EDICTS
    // ==========================================
    const updatedTurnCount = useGameStore.getState().turnCount;
    if (updatedTurnCount % 3 === 0) {
      store.setActiveSpeaker('judge');
      setStatusMessage('ГЛАВНЫЙ РЕДАКТОР ИЗДАЕТ ЭДИКТ...');
      
      const historyAll = useGameStore.getState().debateLog;
      const newEdict = await generateJudgeEdict(historyAll);
      store.setCurrentEdict(newEdict);
      
      store.addMessage({ 
        id: generateId(), 
        role: 'judge', 
        content: `[ЭДИКТ РЕДАКЦИИ]: ${newEdict}` 
      });
      
      // Regenerate quotas if applicable
      store.regenerateQuotas();
    }

    // Increment turn count
    store.incrementTurn();

    // Reset speaker to player (Frank)
    store.setActiveSpeaker('frank');
    setStatusMessage(null);
  }, [store, setStatusMessage, userHandle]);

  return { processTurn };
};

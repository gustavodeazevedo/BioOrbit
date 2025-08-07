import React, { createContext, useState, useEffect, useContext } from 'react';
import versionService from '../services/versionService';

// Criando o contexto de versão
const VersionContext = createContext();

// Hook personalizado para usar o contexto de versão
export const useVersion = () => {
  return useContext(VersionContext);
};

// Provedor do contexto de versão
export const VersionProvider = ({ children }) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [versionInfo, setVersionInfo] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  // Verificar por atualizações
  const checkForUpdates = async () => {
    try {
      setCheckingUpdate(true);
      const result = await versionService.checkForUpdates();
      
      setVersionInfo(result.latestVersion);
      setHasUpdate(result.hasUpdate);
      
      // Se há atualização, salvar a nova versão
      if (result.hasUpdate) {
        console.log('Nova versão detectada:', result.latestVersion.version);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    } finally {
      setCheckingUpdate(false);
    }
  };

  // Forçar atualização
  const forceUpdate = () => {
    versionService.forceUpdate();
  };

  // Descartar notificação de atualização
  const dismissUpdate = () => {
    // Atualizar a versão local para a nova versão para não mostrar mais a notificação
    if (versionInfo) {
      versionService.setCurrentVersion(versionInfo);
      setHasUpdate(false);
    }
  };

  // Verificar atualizações inicialmente e depois periodicamente
  useEffect(() => {
    // Verificação inicial
    checkForUpdates();

    // Verificar a cada 5 minutos (300000ms)
    const interval = setInterval(checkForUpdates, 300000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Valor do contexto
  const value = {
    hasUpdate,
    versionInfo,
    checkingUpdate,
    checkForUpdates,
    forceUpdate,
    dismissUpdate
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};
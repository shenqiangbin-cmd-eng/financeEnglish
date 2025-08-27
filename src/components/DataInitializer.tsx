import React, { useEffect, useState } from 'react';
import { dataImportService } from '../services/dataImport';
import './DataInitializer.css';

interface DataInitializerProps {
  children: React.ReactNode;
}

interface InitState {
  isInitializing: boolean;
  isComplete: boolean;
  error: string | null;
  progress: string;
}

/**
 * 数据初始化组件
 * 在应用启动时检查并导入初始词汇数据
 */
export const DataInitializer: React.FC<DataInitializerProps> = ({ children }) => {
  const [state, setState] = useState<InitState>({
    isInitializing: true,
    isComplete: false,
    error: null,
    progress: '检查数据状态...'
  });

  useEffect(() => {
    // 在测试环境中跳过数据初始化
    if (process.env.NODE_ENV === 'test') {
      setState(prev => ({ ...prev, isInitializing: false, isComplete: true }));
      return;
    }
    
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setState((prev) => ({ ...prev, progress: '检查数据状态...' }));
      
      // 检查是否已经导入过数据
      const isImported = await dataImportService.isDataImported();
      
      if (!isImported) {
        setState((prev) => ({ ...prev, progress: '导入初始词汇数据...' }));
        
        // 导入初始数据
        await dataImportService.importInitialData();
        
        setState((prev) => ({ ...prev, progress: '数据导入完成' }));
      } else {
        setState((prev) => ({ ...prev, progress: '数据已存在' }));
      }
      
      // 验证数据完整性
      setState((prev) => ({ ...prev, progress: '验证数据完整性...' }));
      const validation = await dataImportService.validateData();
      
      if (!validation.isValid) {
        console.warn('数据验证发现问题:', validation.errors);
        // 可以选择重新导入数据或显示警告
      }
      
      // 获取统计信息
      const stats = await dataImportService.getDataStats();
      console.log('词汇数据统计:', stats);
      
      setState({
        isInitializing: false,
        isComplete: true,
        error: null,
        progress: '初始化完成'
      });
      
    } catch (error) {
      console.error('数据初始化失败:', error);
      setState({
        isInitializing: false,
        isComplete: false,
        error: error instanceof Error ? error.message : '数据初始化失败',
        progress: '初始化失败'
      });
    }
  };

  const retryInitialization = () => {
    setState({
      isInitializing: true,
      isComplete: false,
      error: null,
      progress: '重新初始化...'
    });
    initializeData();
  };

  // 如果正在初始化，显示加载界面
  if (state.isInitializing) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3e3e3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{
            margin: '0 0 16px 0',
            color: '#333',
            fontSize: '24px'
          }}>正在初始化应用数据</h2>
          <p style={{
            margin: '0',
            color: '#666',
            fontSize: '16px'
          }}>{state.progress}</p>
        </div>
      </div>
    );
  }

  // 如果初始化失败，显示错误界面
  if (state.error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>⚠️</div>
          <h2 style={{
            margin: '0 0 16px 0',
            color: '#d32f2f',
            fontSize: '24px'
          }}>数据初始化失败</h2>
          <p style={{
            margin: '0 0 24px 0',
            color: '#666',
            fontSize: '16px'
          }}>{state.error}</p>
          <button 
            onClick={retryInitialization}
            style={{
              background: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1565c0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1976d2'}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 初始化完成，渲染子组件
  return <>{children}</>;
};

export default DataInitializer;
import { useEffect } from 'react';
import {
  PROXY_GET_ARTICLE_LSIT,
  PROXY_GET_CHANNEL_LIST,
  PROXY_GET_ARTICLE_LIST_IN_CHANNEL,
  MANUAL_SYNC_UNREAD_WITH_CHANNEL_ID,
  MARK_ARTICLE_READ,
} from '../../event/constant';
import { ArticleReadStatus } from '../../infra/constants/status';
import { Article } from '../../infra/types';
import { useEventPub } from './useEventPub';

export const useDataProxy = () => {
  const { emit, on } = useEventPub();
  const proxy = (name: string, data?: any): any => {
    return new Promise((resolve, reject) => {
      on(name, (_event, result) => {
        return resolve(result);
      });

      emit(name, data);
    });
  };

  useEffect(() => {});

  function getChannelList(): Promise<any> {
    return proxy(PROXY_GET_CHANNEL_LIST);
  }

  function getArticleList(params: any): Promise<any> {
    return proxy(PROXY_GET_ARTICLE_LSIT, params);
  }

  function getArticleListInChannel(params: any): Promise<any> {
    return proxy(PROXY_GET_ARTICLE_LIST_IN_CHANNEL, params);
  }

  function syncArticlesInCurrentChannel(params: {
    channelId: string;
    readStatus: ArticleReadStatus;
  }): Promise<any> {
    return proxy(MANUAL_SYNC_UNREAD_WITH_CHANNEL_ID, params);
  }

  function markAsRead(article: Article): Promise<boolean> {
    return proxy(MARK_ARTICLE_READ, article);
  }

  return {
    getChannelList,
    getArticleList,
    getArticleListInChannel,

    syncArticlesInCurrentChannel,
    markAsRead,
  };
};
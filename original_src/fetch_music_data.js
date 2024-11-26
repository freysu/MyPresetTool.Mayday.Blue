/*
 * @Author: freysu
 * @Date: 2024-11-27 03:28:10
 * @LastEditors: freysu
 * @LastEditTime: 2024-11-27 05:49:04
 * @Description: file content
 */
import axios from 'axios';
import { createLRU } from 'lru.min';
import axiosRetry from 'axios-retry';
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // 只在服务不可用（503）或者请求超时（ECONNABORTED）时重试
    return error.response?.status === 503 || error.code === 'ECONNABORTED';
  },
});

const ENDPOINT_CENGUIGUI = 'https://api.cenguigui.cn/api/netease/music_v1.php';

const ENDPOINT_CLOUDMUSIC = 'https://music.163.com/api/search/get/web';

const options_CENGGUIGUI = {
  method: 'GET',
  headers: {
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8',
  },
  timeout: 30000,
  compress: true,
};

const options_cloudMusic = {
  method: 'GET',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    Referer: 'https://music.163.com',
  },
};

const musicCache = createLRU({
  max: 150_000,
  onEviction: (key, value) => {
    console.log(`Key "${key}" with value "${value}" has been evicted.`);
  },
});

const songListCache = createLRU({
  max: 150_000,
  onEviction: (key, value) => {
    console.log(`Key "${key}" with value "${value}" has been evicted.`);
  },
});

// 获取缓存数据
function getFromCache(CACHE, cacheKey) {
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }
  return null;
}

// 设置缓存数据
function setToCache(CACHE, cacheKey, data) {
  CACHE.set(cacheKey, data);
}

// 验证参数
function validateParams_CENGGUIGUI(params) {
  if (!params.id) {
    throw new Error('Song ID is required');
  }
  if (params.type && !['json', 'mp3', 'pic', 'mv', 'lyric'].includes(params.type)) {
    throw new Error('Invalid type parameter');
  }
  if (
    params.level &&
    !['standard', 'exhigh', 'lossless', 'hires', 'jyeffect', 'sky', 'jymaster'].includes(
      params.level,
    )
  ) {
    throw new Error('Invalid level parameter');
  }
  // 防止 SQL 注入等攻击
  if (typeof params.id !== 'string' || !/^\d+$/.test(params.id)) {
    throw new Error('Invalid song ID format');
  }
}

/*
https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={query}&type=1&offset=0&total=true&limit=100
requestData: {
    s: query,
    type: 1, // 搜索类型：歌曲
    limit: Math.max(1, Math.min(limit, 100)), // 限制 limit 在 1 到 100 之间
    offset: Math.max(0, offset), // 确保 offset 是非负数
    total: true
  }
*/
function fetchSongList(sss) {
  return new Promise((resolve, reject) => {
    try {
      let params = {
        s: sss.query,
        type: 1, // 搜索类型：歌曲
        limit: sss.limit ? Math.max(1, Math.min(sss.limit, 100)) : 10, // 限制 limit 在 1 到 100 之间
        offset: sss.offset ? Math.max(0, sss.offset) : 0, // 确保 offset 是非负数
        total: true,
      };
      const cacheKey = `music_s_${params.s}_limit_${params.limit}_offset_${params.offset}`;
      const cachedData = getFromCache(songListCache, cacheKey);
      if (cachedData) {
        resolve(cachedData);
        return;
      }
      axios
        .get(ENDPOINT_CLOUDMUSIC, {
          params,
          ...options_cloudMusic,
        })
        .then((response) => {
          const data = JSON.stringify(response.data).songs;
          setToCache(songListCache, cacheKey, data);
          resolve(data);
        })
        .catch((error) => {
          if (error.response) {
            console.error(
              'Server responded with an error:',
              error.response.status,
              error.response.data,
            );
          } else if (error.request) {
            console.error('Request was made but no response was received:', error.request);
          } else {
            console.error('Error setting up the request:', error.message);
          }
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function fetchSongData(params) {
  return new Promise((resolve, reject) => {
    try {
      params.id = params.id;
      params.type = params.type || 'json';
      params.level = params.level || 'standard';
      validateParams_CENGGUIGUI(params);
      const cacheKey = `music_id_${params.id}_type_${params.type}_level_${params.level}`;
      const cachedData = getFromCache(musicCache, cacheKey);
      if (cachedData) {
        resolve(cachedData);
        return;
      }
      axios
        .get(ENDPOINT_CENGUIGUI, {
          params,
          ...options_CENGGUIGUI,
        })
        .then((response) => {
          const data = response.data;
          if (data.name !== null) {
            setToCache(musicCache, cacheKey, data);
            resolve(data);
          } else {
            reject(new Error('Invalid song data,' + data.url));
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error(
              'Server responded with an error:',
              error.response.status,
              error.response.data,
            );
          } else if (error.request) {
            console.error('Request was made but no response was received:', error.request);
          } else {
            console.error('Error setting up the request:', error.message);
          }
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export { fetchSongData, fetchSongList };

/*

*/

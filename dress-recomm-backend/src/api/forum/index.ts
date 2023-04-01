import request from "@/utils/request";

/**
 * 获取推荐帖子
 *
 */
export function getRecommApi() {
  return request({
    url: `/dress/forum/getByCategory/2`,
    method: 'get',
  });
}

/**
 * 获取求助帖子
 *
 */
export function getHelpApi() {
  return request({
    url: `/dress/forum/getByCategory/1`,
    method: 'get',
  });
}
/**
 * 获取求助帖子
 *
 */
export function deleteForumApi(forumId: string) {
  return request({
    url: `/dress/forum/deleteForum/${forumId}`,
    method: 'delete',
  });
}


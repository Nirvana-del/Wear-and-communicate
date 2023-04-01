import request from "@/utils/request";

export function getAllCommentApi() {
  return request({
    url: `/dress/comment/getAll`,
    method: 'get',
  });
}

export function deleteCommentApi(id: string) {
  return request({
    url: `/dress/comment/deleteComment/${id}`,
    method: 'delete',
  });
}

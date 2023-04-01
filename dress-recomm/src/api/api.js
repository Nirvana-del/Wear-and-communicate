import requests from './index';
import axios from "axios";

//登录
export const LoginUser = (loginInfo) =>
    requests({
        url: `/dress/auth/login`,
        method: 'post',
        params: loginInfo
    });

//登录
export const RegisterUserApi = (RegisterInfo) =>
    requests({
        url: `/dress/users`,
        method: 'post',
        data: RegisterInfo
    });
//获取个人信息
export const getSelfInfo = () =>
    requests({
        url: `/dress/users/me`,
        method: 'get'
    });
//根据主键获取个人信息
export const getSelfInfoById = (id) =>
    requests({
        url: `/dress/users/getUserInfo/${id}`,
        method: 'get'
    });


//修改用户自己的信息（前台使用）
export const UpdateSelfInfor = (id, editinfoForm) =>
    requests({
        url: '/dress/users/' + id,
        method: 'put',
        data: editinfoForm
    });
//上传图片
export const uploadPiture = (data) =>
    requests({
        url: `/dress/file/upload`,
        method: 'post',
        data: data
    });

//获取所有帖子
export const viewsAllInvitation = () =>
    requests({
        url: `/dress/forum/getAllForum`,
        method: 'get',
        headers: {}
    });

//获取所有帖子
export const getForumByCateApi = (categoryId) =>
    requests({
        url: `/dress/forum/getByCategory/${categoryId}`,
        method: 'get',
        headers: {}
    });
//获取帖子详情
export const getInvitationDetail = (forumId) =>
    requests({
        url: `/dress/forum/getForumById/${forumId}`,
        method: 'get',
    });

//添加评论
export const addComment = (articleId, commentContent) =>
    requests({
        url: `/dress/comment/addComment`,
        method: 'post',
        params: {
            articleId,
            commentContent
        }
    });
//添加二级评论
export const addCommentLevel2 = (parentId, commentContent) =>
    requests({
        url: `/dress/comment/addCommentLevel2`,
        method: 'post',
        params: {
            parentId,
            commentContent
        }
    });
//获取所有一级评论
export const getAllFirstComment = (articleId) =>
    requests({
        url: `/dress/comment/getAllComment/${articleId}`,
        method: 'get',
    });

//获取评论子评论
export const getChildrenComment = (commentId) =>
    requests({
        url: `/dress/comment/getSubcommentary/${commentId}`,
        method: 'get',
    });

export const getChatListApi = (username) => (
    axios({
        baseURL: '/msg',
        url: `/dress/chat/getChatList/${username}`,
        method: 'get'
    })
)
export const sendMessageApi = (msg) => (
    axios({
        baseURL: '/msg',
        url: `/dress/chat/sendMessage`,
        method: 'post',
        params:{
          ...msg
        }
    })
)
export const updateStyleApi = (userInfo) => (
    requests({
        url: `/dress/style/update`,
        method: 'put',
        params: userInfo
    })
)
export const getSelfForumApi = () => (
    requests({
        url: `/dress/forum/getSelfForum`,
        method: 'get',
    })
)
export const deleteForumApi = (forumId) => (
    requests({
        url: `/dress/forum/deleteSelfForum/${forumId}`,
        method: 'delete',
    })
)
export const likeCommentApi = (commentId) => (
    requests({
        url: `/dress/comment/likeComment/${commentId}`,
        method: 'get',
    })
)
export const cancelLikeCommentApi = (commentId) => (
    requests({
        url: `/dress/comment/cancelStar/${commentId}`,
        method: 'delete',
    })
)
export const likeForumApi = (forumId) => (
    requests({
        url: `/dress/forum/likeForum/${forumId}`,
        method: 'get',
    })
)
export const addForumApi = (data) => (
    requests({
        url: `/dress/forum/addForum`,
        method: 'post',
        params: data
    })
)
export const getCategoryApi = () => (
    requests({
        url: `/dress/category/getCategory`,
        method: 'get'
    })
)
/**
 * 上传文件
 *
 * @param file
 */
export const uploadFileApi = (file) => {
    return requests({
      url: '/dress/file/upload1',
      method: 'post',
      data: file,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
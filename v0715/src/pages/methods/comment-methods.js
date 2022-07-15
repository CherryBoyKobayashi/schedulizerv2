import { v4 as uuidv4 } from 'uuid';
import Comment from '../comment';

function addComment(taskData, creator, members, linkedFiles, description) {
    let commentId = uuidv4();
    taskData.comments[commentId] = new Comment(commentId, {"creator":creator, "creation-time":Date.now(), "members": members, "linked-files":linkedFiles, "description":description});
}

function deleteComment(comments, commentId) {
    delete comments[commentId];
}

function updateComment(comments, commentId, creator, creationTime, members, linkedFiles, description) {
    comments[commentId].commentData = {"creator":creator, "creation-time":creationTime, "members": members, "linked-files":linkedFiles, "description":description};
}

function saveComment(comment) {
    localStorage.setItem(comment.commentId, JSON.stringify(comment.commentData));
}

export {addComment, deleteComment, updateComment, saveComment}; 
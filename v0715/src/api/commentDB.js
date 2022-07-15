function getCommentDetails(commentId) {
    return JSON.parse(localStorage[commentId]);
}

export default getCommentDetails; 
module.exports.checkComment = function(req, res, next) {
    let content = req.body.content;
    content = content.trim()

    if(!content || content === "") {
        res.redirect("/")

        return
    }

    next()
}
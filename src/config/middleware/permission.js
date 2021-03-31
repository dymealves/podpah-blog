export const permission = (req, res, next) => {
    if(req.session.user && req.session.user.permission === "administrator") {
        next()
    } else {
        res.redirect("/")
    }
}
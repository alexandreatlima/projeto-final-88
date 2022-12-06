export default function isAdmin(req, res, next) {
  const user = req.currentUser;

  if (user.role !== "ADMIN") {
    return res
      .status(401)
      .json({ msg: "Usuário não tem autorização para executar essa função." });
  }

  next();
}

const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const GenerateJWTandPassToken = async (res, payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRETE, {
    expiresIn: '1d',
  });
  res.cookie('token', token, {
    expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
};

const Authenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new CustomError('Bad Authorizatoin, please log in first', 401));
  }
  try {
    const decode = jwt.decode(token);
    req.user = {
      userId: decode.userId,
      name: decode.name,
      email: decode.email,
      status: decode.status,
    };
    next();
  } catch (error) {
    next(error);
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.status !== 'admin') {
    return next(
      new CustomError(
        'Authorization Error, you are not allowed to do admin operation'
      ),
      401
    );
  }
  next();
};

module.exports = { GenerateJWTandPassToken, Authenticated, isAdmin };

const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

const GenerateJWTandPassToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRETE, {
    expiresIn: '1d',
  });
  return token;
};

const Authenticated = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return next(
      new CustomError('Bad authentication, please log in first', 401)
    );
  }

  const token = header.split(' ')[1];
  if (!header.startsWith('Bearer ') || !token) {
    return next(
      new CustomError('Bad authentication, please log in first', 401)
    );
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

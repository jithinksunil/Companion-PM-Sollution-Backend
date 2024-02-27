import { updateGuest } from '../../dataBaserepository/guestRepository';
import ErrorResponse from '../../error/ErrorResponse';
import { reqType, resType } from '../../types/expressTypes';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const superUserVerifyToken = (
  req: reqType,
  res: resType,
  next: (err?: ErrorResponse) => void
) => {
  const superUserToken: string | undefined = req.headers.authorization;
  console.log(superUserToken);

  if (superUserToken) {
    jwt.verify(
      superUserToken,
      'mySecretKeyForSuperUser',
      async (err, decoded) => {
        if (err) {
          next(ErrorResponse.forbidden('Session expired'));
        } else {
          const payload: JwtPayload = decoded as JwtPayload;
          if (payload?.createdAt) {
            //only for guest users
            let remainingTime =
              payload?.createdAt + 30 * 60 * 1000 - Date.now();
            remainingTime = Math.floor(remainingTime / 1000 / 60);
            if (remainingTime < 0) {
              await updateGuest(superUserToken);
              return next(ErrorResponse.forbidden('Full access expired'));
            }
            req.remainingTime = remainingTime;
          }
          req.superUser = payload;
          next();
        }
      }
    );
  } else {
    next(ErrorResponse.unauthorized('Un-authorised access'));
  }
};

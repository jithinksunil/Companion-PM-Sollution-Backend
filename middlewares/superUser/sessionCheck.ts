import ErrorResponse from '../../error/ErrorResponse';
import { reqType, resType } from '../../types/expressTypes';
export const superUserSessionCheck = (
  req: reqType,
  res: resType,
  next: (err?: ErrorResponse) => void
) => {
  console.log(!!req.session.superUser);

  if (req.session.superUser) {
    console.log('session verified');
    next();
  } else {
    next(ErrorResponse.unauthorized('Un-authorised access'));
  }
};

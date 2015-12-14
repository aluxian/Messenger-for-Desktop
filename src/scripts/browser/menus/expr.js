import * as exprClick from './expr-click';
import * as exprParse from './expr-parse';
import * as exprMeta from './expr-meta';
import * as exprValue from './expr-value';
import * as exprPlatform from './expr-platform';

export default Object.assign.apply(Object, [{},
  exprClick,
  exprParse,
  exprMeta,
  exprValue,
  exprPlatform
]);

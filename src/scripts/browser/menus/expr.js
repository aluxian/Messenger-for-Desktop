import * as exprClick from './expr-click';
import * as exprParse from './expr-parse';
import * as exprMeta from './expr-meta';
import * as exprValue from './expr-value';
import * as exprUtils from './expr-utils';

export default Object.assign.apply(Object, [{},
  exprClick,
  exprParse,
  exprMeta,
  exprValue,
  exprUtils
]);

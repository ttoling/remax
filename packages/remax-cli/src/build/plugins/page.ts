import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { addNamed } from '@babel/helper-module-imports';

function pageConfigExpression(
  path: NodePath<t.ExportDefaultDeclaration>,
  id: t.Identifier,
  singleton: boolean
) {
  const createId = addNamed(path, 'createPageConfig', 'remax');
  path.insertAfter(
    t.exportDefaultDeclaration(
      t.callExpression(t.identifier('Page'), [
        t.callExpression(createId, [id]),
        t.booleanLiteral(singleton),
      ])
    )
  );
}

export default (singleton: boolean) => ({
  visitor: {
    ExportDefaultDeclaration: (path: NodePath<t.ExportDefaultDeclaration>) => {
      if (t.isExpression(path.node.declaration)) {
        const pageId = path.scope.generateUidIdentifier('page');
        const declaration = path.node.declaration;
        path.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(pageId, declaration),
          ])
        );
        pageConfigExpression(path, pageId, singleton);
        path.stop();
      } else if (
        t.isFunctionDeclaration(path.node.declaration) ||
        t.isClassDeclaration(path.node.declaration)
      ) {
        const declaration = path.node.declaration;
        const pageId = path.scope.generateUidIdentifierBasedOnNode(path.node);
        declaration.id = pageId;
        path.replaceWith(declaration);
        pageConfigExpression(path, pageId, singleton);
        path.stop();
      }
    },
  },
});

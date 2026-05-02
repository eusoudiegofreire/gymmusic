# Workflow.md — Gym Music IA
## Regras de Trabalho por Issue

---

## Regra 1 — Uma issue por vez

- Cada sessão de trabalho resolve exatamente **uma issue** do `ISSUES.md`
- Não iniciar a próxima issue sem concluir e validar a atual
- Se surgir algo fora do escopo durante o trabalho, anotar para a issue correta — não implementar agora

---

## Regra 2 — Nunca misturar front-end e back-end na mesma sessão

As issues são separadas por camada por design. Respeitar essa separação:

| Issues #01–#27 | Front-end exclusivamente |
|----------------|--------------------------|
| Issues #28–#46 | Back-end / integração |

Durante uma issue de front-end:
- Usar dados mockados (hardcoded ou via props fake)
- Não conectar ao Supabase, Stripe ou qualquer API real
- Não escrever Server Actions, Route Handlers ou lógica de banco

Durante uma issue de back-end:
- Não alterar componentes visuais além do necessário para conectar o dado
- Não refatorar estilos ou layout

---

## Regra 3 — Seguir a ordem do ISSUES.md

A ordem das issues não é sugestão — é dependência técnica:

- O Design System (#01) deve existir antes de qualquer página
- Componentes base (#03–#06) devem existir antes das páginas que os usam
- Toda página visual deve estar pronta antes de conectar ao back-end
- O schema SQL (#28) deve existir antes de qualquer Server Action
- O middleware (#30) deve existir antes de conectar autenticação

Nunca pular uma issue. Se uma issue parece desnecessária, revisar o SPEC antes de removê-la.

---

## Regra 4 — Não modificar arquivos fora do escopo da issue atual

Cada issue lista exatamente quais arquivos serão tocados. Respeitar essa lista:

- Se um arquivo não está listado na issue, **não editá-lo**
- Se for necessário criar um novo arquivo não previsto, justificar antes de criar
- Refatorações oportunistas ("já que estou aqui, vou melhorar isso...") são proibidas
- Correções de bugs encontrados em outros arquivos: criar issue nova ou anotar

---

## Regra 5 — Critério de conclusão (Definition of Done)

Uma issue só está concluída quando **todos** os itens do seu DoD estão atendidos.

Não marcar como concluída se:
- Algum item do DoD não foi testado visualmente
- Há erros no console do browser ou no terminal
- O componente só funciona com dados específicos e quebra com outros
- Um arquivo fora do escopo foi modificado

---

## Fluxo de Trabalho por Sessão

```
1. Abrir ISSUES.md
2. Identificar a próxima issue não concluída
3. Ler o escopo completo da issue (o que cria, arquivos, DoD)
4. Ler os arquivos de referência relevantes:
   - Sempre: DesignSystem.md (para issues de FE)
   - Sempre: Architecture.md (para issues de BE)
5. Implementar apenas o escopo listado
6. Verificar cada item do DoD
7. Marcar issue como concluída
8. Partir para a próxima
```

---

## Referências Rápidas

| Documento | Quando consultar |
|-----------|-----------------|
| `SPEC.md` | Dúvidas sobre comportamento esperado de qualquer página ou feature |
| `ISSUES.md` | Para saber qual é a próxima issue e seu escopo exato |
| `_references/Architecture.md` | Qualquer dúvida sobre onde colocar lógica, segurança de chaves ou fluxo de dados |
| `_references/DesignSystem.md` | Qualquer dúvida sobre cores, componentes, tipografia ou ícones |
| `_references/Workflow.md` | Este arquivo — regras de como trabalhar |

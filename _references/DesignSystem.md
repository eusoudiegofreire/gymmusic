# DesignSystem.md — Gym Music IA
## Tema: "Energia Elétrica"

---

## Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| Primária | `#F97316` | Botões principais, destaques, ícones ativos, barra de progresso do player |
| Hover primária | `#EA6E0A` | Estado hover de botões primários |
| Secundária | `#EF4444` | Alertas, ações destrutivas, badge "inadimplente" |
| Fundo principal | `#0A0A0A` | Background do app e de inputs |
| Fundo de superfícies | `#1A1A1A` | Cards, modais, sidebars, drawers |
| Texto primário | `#FFFFFF` | Títulos, corpo principal |
| Texto secundário | `#999999` | Labels, metadados, placeholders, texto auxiliar |
| Bordas | `#333333` | Divisores, bordas de card, bordas de input |

---

## Badges de Status de Assinatura

| Status | Cor de fundo | Texto |
|--------|-------------|-------|
| `ativa` | `#F97316` | "Ativa" |
| `trial` | `#EAB308` | "Trial" |
| `inadimplente` | `#EF4444` | "Inadimplente" |
| `cancelada` | `#666666` | "Cancelada" |

Texto do badge sempre `#FFFFFF`. Componente: `components/ui/status-badge.tsx`.

---

## Componentes shadcn/ui

shadcn/ui é a biblioteca base de componentes. Todos os componentes são customizados com a paleta "Energia Elétrica".

### Botões

```
Primário:    fundo #F97316 | hover #EA6E0A | texto #FFFFFF | sem borda
Secundário:  fundo transparente | borda #333333 | texto #FFFFFF | hover fundo #1A1A1A
Destrutivo:  fundo #EF4444 | hover escurecido | texto #FFFFFF
```

### Cards

```
Fundo:        #1A1A1A
Borda:        #333333
Border-radius: 8px
Padding:      16px–24px
```

### Inputs

```
Fundo:          #0A0A0A
Borda padrão:   #333333
Borda em foco:  #F97316
Texto:          #FFFFFF
Placeholder:    #999999
```

### Player de Música

```
Fundo:              #1A1A1A
Barra de progresso: #F97316 (preenchida) | #333333 (trilha)
Controles:          ícones Lucide React, cor #FFFFFF | hover #F97316
Volume:             slider com mesma lógica da barra de progresso
```

### Tabelas (Admin)

```
Header:       fundo #1A1A1A, texto #999999
Linhas pares: fundo #0A0A0A
Linhas ímpares: fundo #111111
Hover linha:  fundo #1A1A1A
Borda:        #333333
```

---

## Tipografia

| Elemento | Especificação |
|----------|--------------|
| Fonte principal | Geist Sans (padrão Next.js) ou Inter |
| Estilo | Sem-serif geométrica |
| Peso | Regular (400) para corpo, Semibold (600) para títulos, Bold (700) para hero |
| Tamanhos base | 14px corpo, 16px padrão, 24px h3, 32px h2, 48px h1 |

---

## Ícones

Biblioteca: **Lucide React** (`lucide-react`)

Uso padrão:
- Tamanho padrão: `size={16}` para inline, `size={20}` para botões, `size={24}` para cards
- Cor: herda do texto por padrão; cor primária `#F97316` para ícones de destaque/ativos

---

## Responsividade

- **Abordagem**: Mobile-first (Tailwind padrão)
- **Dashboard e Admin**: otimizados para tablet/desktop (mín. 768px)
- **Landing page**: totalmente responsiva, incluindo mobile
- **Breakpoints Tailwind**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Sidebar admin**: colapsada em mobile, expandida em desktop

---

## Variáveis CSS (globals.css)

As cores devem ser definidas como variáveis CSS para integração com shadcn/ui:

```css
:root {
  --background: 0 0% 4%;           /* #0A0A0A */
  --foreground: 0 0% 100%;         /* #FFFFFF */
  --card: 0 0% 10%;                /* #1A1A1A */
  --card-foreground: 0 0% 100%;
  --border: 0 0% 20%;              /* #333333 */
  --input: 0 0% 4%;                /* #0A0A0A */
  --primary: 25 95% 53%;           /* #F97316 */
  --primary-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;        /* #EF4444 */
  --muted: 0 0% 60%;               /* #999999 */
  --muted-foreground: 0 0% 60%;
  --ring: 25 95% 53%;              /* #F97316 foco */
}
```

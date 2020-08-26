## 🤖 Crawler de Taxas de Máquinas de Cartão 💳

##### Este bot utiliza informações do website 🌐 **https://www.calculadoradetaxas.com.br/**

### 📥 Instalação
Para utilizar, clone o projeto e na pasta raiz utilize os comandos:
```
yarn
yarn dev
```

#### Após a instalação e inicialização, as seguintes rotas estarão disponíveis:

##### /names
###### 📋 Retorna uma lista com os nomes das maquininhas disponíveis.
```

```
##### /data/all
###### 📂 Retorna uma lista com os dados de todas as maquininhas. Leva de 40-70 segundos para extraír todo o conteúdo.
###### *Verifique o modelo dos dados extraídos em [Machine.ts](/models/Machine.ts)*

```

```

### 📌 To-do
- [x] Aprender Typescript
- [x] Estrutura de dados
- [x] Dados da maquininha atual ~~(imagem, título e links úteis)~~
- [x] Pegar taxas das operações mais comuns ~~(ex.: Débito, Crédito a Vista, etc.)~~
- [x] Pegar separadamente as taxas das diferentes modalidades de recebimento das maquininhas
- [x] Pegar valores de todos os inputs em que a *label* contenha a palavra **Taxa**
- [ ] Tipos de taxa aninhados (**Maquininha BIN** - *Ramo de atividade*)
- [ ] Melhorar README 😅


```

```

### 📜 Exemplo de Resposta
##### */data/all*
```
[
  {
    "name": "Minizinha",
    "link": "https://www.calculadoradetaxas.com.br/calculadora/minizinha",
    "imgLink": "https://www.calculadoradetaxas.com.br/img/pagseguro/minizinha.png",
    "types": [
        {
            "name": "Na Hora",
            "fees": [
                { "name": "Taxa Débito", "fee": 0.00, "type": "%" },
                { "name": "Taxa Crédito a Vista", "fee": 0.00, "type": "%" },
                { "name": "Taxa de Crédito Parcelado", "fee": 5.59, "type": "%" },
                { "name": "Taxa de Parcelamento", "fee": 2.99, "type": "%" }
            ]
        },
        {
            "name": "14 Dias",
            "fees": [
                { "name": "Taxa Débito", "fee": 0.00, "type": "%" },
                { "name": "Taxa Crédito a Vista", "fee": 0.00, "type": "%" },
                { "name": "Taxa de Crédito Parcelado", "fee": 4.59, "type": "%" },
                { "name": "Taxa de Parcelamento", "fee": 2.99, "type": "%" }
            ]
        },

        ...
    ]
  },

  ...
]
```

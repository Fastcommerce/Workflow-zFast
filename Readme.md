## Intro

Este é o workflow inicial para facilitar o desenvolvimento de lojas para a zFast

## Instalação

Para instalar as dependências do package.json acesse a pasta correspondente via cmd e execute o seguinte comando: 

```
npm i
```

## Rodando o workflow

Para rodar o workflow basta executar o seguinte comando em seu cmd :

```
gulp
```

## Observações

Todos os caminhos de **DESTINO**(.dest) contidos no arquivo **Gulpfile.babel** são fictícios e devem ser alterados pelo caminho da loja em que está trabalhando, por exemplo, onde está:

```
./build/images/
```
- Substituir pelo caminho de sua loja. Exemplo: 

```
//192.168.0.2/IDLoja/images/
```
- **Obs**: Existem mais caminhos de destino no arquivo Gulpfile.babel para seream alterados para o que está utilizando

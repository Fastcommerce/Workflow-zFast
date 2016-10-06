## Intro

Este � o workflow inicial para facilitar o desenvolvimento de lojas para a zFast

## Instala��o

Para instalar as depend�ncias do package.json acesse a pasta correspondente via cmd e execute o seguinte comando: 

```
npm i
```

## Rodando o workflow

Para rodar o workflow basta executar o seguinte comando em seu cmd :

```
gulp
```

## Observa��es

Todos os caminhos de **DESTINO**(.dest) contidos no arquivo **Gulpfile.babel** s�o fict�cios e devem ser alterados pelo caminho da loja em que est� trabalhando, por exemplo, onde est�:

```
./build/images/
```
- Substituir pelo caminho de sua loja. Exemplo: 

```
//192.168.0.2/IDLoja/images/
```
- **Obs**: Existem mais caminhos de destino no arquivo Gulpfile.babel para seream alterados para o que est� utilizando

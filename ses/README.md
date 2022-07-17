# テンプレートの作成

```sh
aws ses create-template --cli-input-json file://user-list.json

aws cloudformation create-stack \
--stack-name email-template \
--region ap-northeast-1 \
--template-body file://condition.yml
```

# テンプレートの更新

```sh
aws ses update-template --cli-input-json file://user-list.json

aws cloudformation update-stack \
--stack-name email-template \
--region ap-northeast-1 \
--template-body file://condition.yml
```

# メールの送信

`aws ses send-email --from ${FROM} --to ${TO} --subject subject --text text`

# テンプレートを用いたメールの送信

`aws ses send-templated-email --cli-input-json file://send-data.json`

# `~`(Tilde)でホワイトスペースをコントロール

https://handlebarsjs.com/guide/expressions.html#whitespace-control

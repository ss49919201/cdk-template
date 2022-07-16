# テンプレートの作成

`aws ses create-template --cli-input-json file://ses/user-list.json`

# テンプレートの更新

`aws ses update-template --cli-input-json file://ses/user-list.json`

# メールの送信

`aws ses send-email --from ${FROM} --to ${TO} --subject subject --text text`

# テンプレートを用いたメールの送信

`aws ses send-templated-email --cli-input-json file://ses/send-data.json`
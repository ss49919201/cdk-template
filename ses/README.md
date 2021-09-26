# テンプレートの作成

`aws ses create-template --cli-input-json file://ses/loop.json`

# テンプレートの更新

`aws ses update-template --cli-input-json file://ses/loop.json`

# テンプレートを用いたメールの送信

`aws ses send-templated-email --cli-input-json file://ses/send-data.json`
package main

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, sqsEvent events.SQSEvent) error {
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	protocol := os.Getenv("PROTOCOL")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	conn, err := sql.Open("mysql", user+":"+password+"@"+protocol+"("+dbHost+":3306/"+dbName+")")
	if err != nil {
		return err
	}
	defer conn.Close()
	if err := conn.Ping(); err != nil {
		fmt.Println("Failed to connect rds")
		return err
	}

	for _, message := range sqsEvent.Records {
		fmt.Printf("The message %s for event source %s = %s \n", message.MessageId, message.EventSource, message.Body)
	}

	return nil
}

func main() {
	lambda.Start(handler)
}

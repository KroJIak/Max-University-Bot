package keyboards

import (
	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
	"max-bot/services"
)

// ChatsMenu создает клавиатуру со списком чатов с кнопками-ссылками
func (b *Builder) ChatsMenu(chats []services.Chat, webAppURL string) *maxbot.Keyboard {
	keyboard := b.api.Messages.NewKeyboardBuilder()

	// Кнопки-ссылки на чаты
	for _, chat := range chats {
		if chat.URL != "" {
			// Формируем текст кнопки с иконкой и названием
			buttonText := chat.Title
			if chat.Icon != "" {
				buttonText = chat.Icon + " " + buttonText
			}
			keyboard.
				AddRow().
				AddLink(buttonText, schemes.POSITIVE, chat.URL)
		}
	}

	// Кнопка "Назад"
	keyboard.
		AddRow().
		AddCallback("⬅️ Назад", schemes.DEFAULT, "open_services")

	// Кнопки навигации: Главная, Сервисы, Профиль
	navRow := keyboard.AddRow()
	navRow.AddCallback("🏠 Главная", schemes.POSITIVE, "open_main")
	navRow.AddCallback("📋 Сервисы", schemes.POSITIVE, "open_services")
	navRow.AddCallback("👤 Профиль", schemes.POSITIVE, "open_profile")

	// Кнопка "Открыть веб приложение" (если URL указан)
	if webAppURL != "" {
		b.AddOpenApp(keyboard.AddRow(), "🌐 Открыть веб приложение", schemes.POSITIVE, webAppURL)
	}

	return keyboard
}


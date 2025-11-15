package keyboards

import (
	"fmt"

	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
)

// ContactItem представляет контакт для отображения
type ContactItem struct {
	Type       string // "dean" или "department"
	Faculty    string
	Department string
	Phone      string
	Email      string
}

// ContactsListMenu создает клавиатуру со списком контактов и пагинацией
func (b *Builder) ContactsListMenu(contacts []ContactItem, currentPage, totalPages int, webAppURL string) *maxbot.Keyboard {
	keyboard := b.api.Messages.NewKeyboardBuilder()

	// Пагинация: |<<|<|Стр #X|>|>>| (всегда показываем, даже если 1 страница)
	pageRow := keyboard.AddRow()

	// Кнопка |<< (на первую страницу)
	if currentPage > 0 {
		pageRow.AddCallback("|<<", schemes.DEFAULT, "contacts_page_0")
	} else {
		pageRow.AddCallback("|<<", schemes.DEFAULT, "disabled")
	}

	// Кнопка < (на предыдущую страницу)
	if currentPage > 0 {
		payload := fmt.Sprintf("contacts_page_%d", currentPage-1)
		pageRow.AddCallback("<", schemes.DEFAULT, payload)
	} else {
		pageRow.AddCallback("<", schemes.DEFAULT, "disabled")
	}

	// Кнопка с номером страницы (всегда показываем)
	pageText := fmt.Sprintf("Стр #%d", currentPage+1)
	pageRow.AddCallback(pageText, schemes.DEFAULT, "disabled")

	// Кнопка > (на следующую страницу)
	if currentPage < totalPages-1 {
		payload := fmt.Sprintf("contacts_page_%d", currentPage+1)
		pageRow.AddCallback(">", schemes.DEFAULT, payload)
	} else {
		pageRow.AddCallback(">", schemes.DEFAULT, "disabled")
	}

	// Кнопка >>| (на последнюю страницу)
	if currentPage < totalPages-1 {
		payload := fmt.Sprintf("contacts_page_%d", totalPages-1)
		pageRow.AddCallback(">>|", schemes.DEFAULT, payload)
	} else {
		pageRow.AddCallback(">>|", schemes.DEFAULT, "disabled")
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


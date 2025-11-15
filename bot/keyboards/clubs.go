package keyboards

import (
	"fmt"
	maxbot "github.com/max-messenger/max-bot-api-client-go"
	"github.com/max-messenger/max-bot-api-client-go/schemes"
	"max-bot/services"
)

// ClubsListMenu создает клавиатуру со списком клубов и пагинацией
func (b *Builder) ClubsListMenu(clubs []services.Club, currentPage, totalPages int, webAppURL string) *maxbot.Keyboard {
	keyboard := b.api.Messages.NewKeyboardBuilder()

	// Размер страницы (должен совпадать с pageSize в buildClubsListPage)
	const pageSize = 20

	// Начальный номер для текущей страницы
	startNumber := currentPage * pageSize

	// Кнопки-ссылки на клубы - по 1 в строке
	for i, club := range clubs {
		if club.ChatURL != "" {
			// Формируем текст кнопки с иконкой и названием
			buttonText := club.Name
			if club.Image != "" {
				buttonText = club.Image + " " + buttonText
			}
			number := startNumber + i + 1
			buttonText = fmt.Sprintf("%d) %s", number, buttonText)
			keyboard.
				AddRow().
				AddLink(buttonText, schemes.POSITIVE, club.ChatURL)
		}
	}

	// Пагинация: |<<|<|Стр #X|>|>>| (всегда показываем, даже если 1 страница)
	pageRow := keyboard.AddRow()

	// Кнопка |<< (на первую страницу)
	if currentPage > 0 {
		pageRow.AddCallback("|<<", schemes.DEFAULT, "clubs_page_0")
	} else {
		pageRow.AddCallback("|<<", schemes.DEFAULT, "disabled")
	}

	// Кнопка < (на предыдущую страницу)
	if currentPage > 0 {
		payload := fmt.Sprintf("clubs_page_%d", currentPage-1)
		pageRow.AddCallback("<", schemes.DEFAULT, payload)
	} else {
		pageRow.AddCallback("<", schemes.DEFAULT, "disabled")
	}

	// Кнопка с номером страницы (всегда показываем)
	pageText := fmt.Sprintf("Стр #%d", currentPage+1)
	pageRow.AddCallback(pageText, schemes.DEFAULT, "disabled")

	// Кнопка > (на следующую страницу)
	if currentPage < totalPages-1 {
		payload := fmt.Sprintf("clubs_page_%d", currentPage+1)
		pageRow.AddCallback(">", schemes.DEFAULT, payload)
	} else {
		pageRow.AddCallback(">", schemes.DEFAULT, "disabled")
	}

	// Кнопка >>| (на последнюю страницу)
	if currentPage < totalPages-1 {
		payload := fmt.Sprintf("clubs_page_%d", totalPages-1)
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


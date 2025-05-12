# Guitar Song Sorter 🎸

This is a simple web application to help you manage and sort your favorite guitar songs and tabs.

**Features:**
- Add songs with title, artist, and a link (YouTube or guitar tabs)
- Automatically detect if the link is YouTube or tabs
- Filter songs by link type (YouTube or tabs)
- Sort songs alphabetically or by most recently opened
- Track when you last clicked (opened) each song
- Save songs persistently using browser localStorage
- Import and export song lists as JSON backup files

---

## ✨ Why I Built This

I created this very simple guitar song sorter because I wanted a personal tool to organize and sort my favorite guitar songs and tabs. I am a casual player who loves exploring new songs and previously, all the songs I was learning or knew how to play were listed in a Google Doc. This made tracking and organizing songs quite difficult and I wanted a quicker way to find the song I wanted to play along with the tabs for that song. I was also tired of not knowing what song to play when my friends would ask me to play a song, so with this guitar sorter I can just show them the list and they can pick out a song. Ultimately, this project helped me practice my web development skills — especially working with localStorage, sorting/filtering logic, and deploying to GitHub Pages.

---

## 🚀 How to Use

1. Click the link to open the app in your browser: https://nicocaparas.github.io/guitar-song-sorter/
2. Add songs by entering the title, artist, and link.
3. Use the sort and filter buttons to organize your list.
4. Click on a song’s link to open it (and mark it as “last opened”).
5. Export your song list to back it up, or import it later.

---

## 🔧 Future Improvements

The interface is very plain right now as you can see so here are some future improvements I am thinking of doing once my fingers hurt from playing too much guitar:

- **Improve front-end design and UI:**  
  Redesign the interface with better visual styling, modern layouts, and responsive design. 

- **Personal notes per song:**  
  Let users add practice notes, chord reminders, or tuning details for each entry.

- **Favorite/starred songs:**  
  Add a way to mark certain songs as favorites for quick access.

- **Search or filter by artist:**  
  Provide a search bar to quickly narrow down songs by title or artist name.

- **Add a safe migration system for localStorage data:**  
  Implement a migration checker to ensure that if the app’s data model or storage format changes, old user data can be safely updated without losing songs or causing errors.

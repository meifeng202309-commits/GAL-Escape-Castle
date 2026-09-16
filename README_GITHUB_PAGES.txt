GitHub Pages deployment for Three Doors V2

Recommended classroom setup:

1. Create a GitHub repository, for example:
   GAL-Escape-Castle

2. Upload these files to the repository root:
   01_setup.sql
   02_player_v2.html
   03_teacher_v2.html
   README_V2.txt

3. In GitHub, open:
   Settings -> Pages

4. Under "Build and deployment":
   Source: Deploy from a branch
   Branch: main
   Folder: /root

5. After GitHub Pages finishes publishing, use the Pages URL:
   https://YOUR_GITHUB_NAME.github.io/GAL-Escape-Castle/02_player_v2.html
   https://YOUR_GITHUB_NAME.github.io/GAL-Escape-Castle/03_teacher_v2.html

6. Students open the player URL.
   They do not need GitHub accounts.
   They only need the shared room code and their assigned role:
   GAL-A, GAL-B, or GAL-C.

7. The teacher opens the teacher URL.
   Use the same room code and click Watch room.

Important:

- GitHub Pages only hosts the HTML pages.
- Supabase still stores and syncs the shared choices.
- Every student's browser must be able to reach:
  https://qdcbdcjobzytzhnhfwyn.supabase.co

If the page opens but Join still shows "Failed to fetch", test the same URL from another network, for example a phone hotspot. If hotspot works, the original network is blocking or failing DNS/proxy access to Supabase.

For privacy:

- The current publishable Supabase key is intended for browser use.
- Keep Row Level Security enabled.
- For a classroom demo, the current open select/insert/delete policies are simple and convenient.
- For real student data, restrict delete access or remove Reset from the public teacher page.

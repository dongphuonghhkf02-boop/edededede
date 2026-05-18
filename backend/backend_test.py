"""
Backend API Testing for TAMIS АГРО Blog Feature
Tests all blog CRUD endpoints, admin auth, contact messages, and image upload.
"""
import requests
import sys
import io
from datetime import datetime

BASE_URL = "https://repo-deploy-55.preview.emergentagent.com/api"

class BlogAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None
        self.test_post_id = None
        self.test_post_slug = None
        self.test_post_id_2 = None

    def log(self, msg: str, level: str = "info"):
        prefix = {
            "info": "ℹ️ ",
            "success": "✅",
            "error": "❌",
            "test": "🔍"
        }.get(level, "")
        print(f"{prefix} {msg}")

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data=None, headers=None, token=None, files=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}/{endpoint}"
        req_headers = {}
        if headers:
            req_headers.update(headers)
        if token:
            req_headers['Authorization'] = f'Bearer {token}'
        if not files and data is not None:
            req_headers['Content-Type'] = 'application/json'

        self.tests_run += 1
        self.log(f"Testing {name}...", "test")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, params=params, timeout=15)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, headers=req_headers, timeout=15)
                else:
                    response = requests.post(url, json=data, headers=req_headers, timeout=15)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=req_headers, timeout=15)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=15)
            else:
                self.log(f"Unsupported method {method}", "error")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"Passed - Status: {response.status_code}", "success")
            else:
                self.log(f"Failed - Expected {expected_status}, got {response.status_code}", "error")
                try:
                    self.log(f"Response: {response.json()}", "error")
                except:
                    self.log(f"Response text: {response.text[:300]}", "error")

            try:
                return success, response.json()
            except:
                return success, {}

        except Exception as e:
            self.log(f"Failed - Error: {str(e)}", "error")
            return False, {}

    # ===== AUTH =====
    def test_admin_login(self):
        """Test POST /api/auth/login with admin credentials"""
        success, response = self.run_test(
            "Admin login (admin@tamis.ua / admin1234)",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@tamis.ua", "password": "admin1234"}
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            user = response.get('user', {})
            self.log(f"Admin token obtained - role: {user.get('role')}", "info")
            if user.get('role') != 'admin':
                self.log("ERROR: User does not have admin role!", "error")
                return False
        return success

    # ===== PUBLIC BLOG ENDPOINTS =====
    def test_blog_posts_list(self):
        """Test GET /api/blog/posts (public list)"""
        success, response = self.run_test(
            "GET /api/blog/posts (public list)",
            "GET",
            "blog/posts",
            200,
            params={"limit": 10}
        )
        if success:
            items = response.get('items', [])
            total = response.get('total', 0)
            self.log(f"Found {len(items)} posts (total: {total})", "info")
            # Verify content_html is stripped in list view
            if items and 'content_html' in items[0]:
                self.log("WARNING: content_html should be stripped in list view", "error")
            # Verify reading_minutes is present
            if items and 'reading_minutes' not in items[0]:
                self.log("ERROR: reading_minutes missing in list response", "error")
                return False
        return success

    def test_blog_posts_filter_category(self):
        """Test GET /api/blog/posts?category=Інокулянти"""
        success, response = self.run_test(
            "GET /api/blog/posts?category=Інокулянти",
            "GET",
            "blog/posts",
            200,
            params={"category": "Інокулянти", "limit": 10}
        )
        if success:
            items = response.get('items', [])
            self.log(f"Found {len(items)} posts in category 'Інокулянти'", "info")
            # Verify all items have the correct category
            for item in items:
                if item.get('category') != 'Інокулянти':
                    self.log(f"ERROR: Post {item.get('slug')} has wrong category: {item.get('category')}", "error")
                    return False
        return success

    def test_blog_posts_filter_tag(self):
        """Test GET /api/blog/posts?tag=соя"""
        success, response = self.run_test(
            "GET /api/blog/posts?tag=соя",
            "GET",
            "blog/posts",
            200,
            params={"tag": "соя", "limit": 10}
        )
        if success:
            items = response.get('items', [])
            self.log(f"Found {len(items)} posts with tag 'соя'", "info")
        return success

    def test_blog_posts_search(self):
        """Test GET /api/blog/posts?q=азот"""
        success, response = self.run_test(
            "GET /api/blog/posts?q=азот",
            "GET",
            "blog/posts",
            200,
            params={"q": "азот", "limit": 10}
        )
        if success:
            items = response.get('items', [])
            self.log(f"Search 'азот' found {len(items)} posts", "info")
        return success

    def test_blog_posts_sort_newest(self):
        """Test GET /api/blog/posts?sort=newest"""
        success, response = self.run_test(
            "GET /api/blog/posts?sort=newest",
            "GET",
            "blog/posts",
            200,
            params={"sort": "newest", "limit": 5}
        )
        return success

    def test_blog_posts_sort_oldest(self):
        """Test GET /api/blog/posts?sort=oldest"""
        success, response = self.run_test(
            "GET /api/blog/posts?sort=oldest",
            "GET",
            "blog/posts",
            200,
            params={"sort": "oldest", "limit": 5}
        )
        return success

    def test_blog_posts_sort_popular(self):
        """Test GET /api/blog/posts?sort=popular"""
        success, response = self.run_test(
            "GET /api/blog/posts?sort=popular",
            "GET",
            "blog/posts",
            200,
            params={"sort": "popular", "limit": 5}
        )
        return success

    def test_blog_post_detail(self):
        """Test GET /api/blog/posts/{slug} (detail + views bump)"""
        # First get a post slug from the list
        _, list_response = self.run_test(
            "GET /api/blog/posts (to get a slug)",
            "GET",
            "blog/posts",
            200,
            params={"limit": 1}
        )
        items = list_response.get('items', [])
        if not items:
            self.log("No posts found to test detail endpoint", "error")
            return False
        
        slug = items[0].get('slug')
        initial_views = items[0].get('views', 0)
        
        success, response = self.run_test(
            f"GET /api/blog/posts/{slug} (detail)",
            "GET",
            f"blog/posts/{slug}",
            200
        )
        if success:
            # Verify content_html is present in detail view
            if 'content_html' not in response:
                self.log("ERROR: content_html missing in detail response", "error")
                return False
            # Verify views were bumped
            new_views = response.get('views', 0)
            if new_views <= initial_views:
                self.log(f"WARNING: Views not bumped (was {initial_views}, now {new_views})", "error")
            else:
                self.log(f"Views bumped: {initial_views} → {new_views}", "info")
            # Store slug for related test
            self.test_post_slug = slug
        return success

    def test_blog_post_detail_404(self):
        """Test GET /api/blog/posts/nonexistent-slug (should 404)"""
        success, _ = self.run_test(
            "GET /api/blog/posts/nonexistent-slug (404)",
            "GET",
            "blog/posts/nonexistent-slug-12345",
            404
        )
        return success

    def test_blog_post_related(self):
        """Test GET /api/blog/posts/{slug}/related"""
        if not self.test_post_slug:
            self.log("Skipping - no test post slug available", "error")
            return False
        
        success, response = self.run_test(
            f"GET /api/blog/posts/{self.test_post_slug}/related",
            "GET",
            f"blog/posts/{self.test_post_slug}/related",
            200,
            params={"limit": 3}
        )
        if success:
            items = response.get('items', [])
            self.log(f"Found {len(items)} related posts", "info")
            # Verify content_html is stripped
            if items and 'content_html' in items[0]:
                self.log("WARNING: content_html should be stripped in related posts", "error")
        return success

    def test_blog_categories(self):
        """Test GET /api/blog/categories"""
        success, response = self.run_test(
            "GET /api/blog/categories",
            "GET",
            "blog/categories",
            200
        )
        if success:
            items = response.get('items', [])
            self.log(f"Found {len(items)} categories", "info")
            for cat in items[:3]:
                self.log(f"  - {cat.get('name')}: {cat.get('count')} posts", "info")
        return success

    def test_blog_tags(self):
        """Test GET /api/blog/tags"""
        success, response = self.run_test(
            "GET /api/blog/tags",
            "GET",
            "blog/tags",
            200
        )
        if success:
            items = response.get('items', [])
            self.log(f"Found {len(items)} tags (top 50)", "info")
            for tag in items[:3]:
                self.log(f"  - {tag.get('name')}: {tag.get('count')} uses", "info")
        return success

    # ===== ADMIN BLOG ENDPOINTS =====
    def test_admin_blog_list_no_auth(self):
        """Test GET /api/admin/blog/posts without auth (should 401)"""
        success, _ = self.run_test(
            "GET /api/admin/blog/posts (no auth → 401)",
            "GET",
            "admin/blog/posts",
            401
        )
        return success

    def test_admin_blog_list(self):
        """Test GET /api/admin/blog/posts (with admin auth)"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "error")
            return False
        
        success, response = self.run_test(
            "GET /api/admin/blog/posts (admin)",
            "GET",
            "admin/blog/posts",
            200,
            token=self.admin_token
        )
        if success:
            items = response.get('items', [])
            total = response.get('total', 0)
            self.log(f"Admin sees {len(items)} posts (total: {total})", "info")
            # Count drafts
            drafts = [p for p in items if p.get('status') == 'draft']
            self.log(f"  - {len(drafts)} drafts, {len(items) - len(drafts)} published", "info")
        return success

    def test_admin_blog_create(self):
        """Test POST /api/admin/blog/posts (create post)"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "error")
            return False
        
        timestamp = datetime.now().strftime('%H%M%S')
        success, response = self.run_test(
            "POST /api/admin/blog/posts (create)",
            "POST",
            "admin/blog/posts",
            200,
            data={
                "title": f"Test Post {timestamp}",
                "excerpt": "This is a test post created by automated testing",
                "content_html": "<p>This is the <strong>content</strong> of the test post. It has multiple words to test reading_minutes calculation.</p><p>Second paragraph with more content to ensure we have enough words for a meaningful reading time estimate.</p>",
                "category": "Тестування",
                "tags": ["test", "automation"],
                "hot": False,
                "status": "draft"
            },
            token=self.admin_token
        )
        if success:
            self.test_post_id = response.get('id')
            self.test_post_slug = response.get('slug')
            self.log(f"Created post: id={self.test_post_id}, slug={self.test_post_slug}", "info")
            # Verify reading_minutes is computed
            reading_minutes = response.get('reading_minutes', 0)
            if reading_minutes < 1:
                self.log("ERROR: reading_minutes should be at least 1", "error")
                return False
            self.log(f"Reading minutes: {reading_minutes}", "info")
        return success

    def test_admin_blog_create_duplicate_title(self):
        """Test POST /api/admin/blog/posts with same title (slug uniqueness)"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "error")
            return False
        
        timestamp = datetime.now().strftime('%H%M%S')
        title = f"Duplicate Title Test {timestamp}"
        
        # Create first post
        success1, response1 = self.run_test(
            "POST /api/admin/blog/posts (first with title)",
            "POST",
            "admin/blog/posts",
            200,
            data={
                "title": title,
                "excerpt": "First post",
                "content_html": "<p>First post content</p>",
                "category": "Тестування",
                "status": "draft"
            },
            token=self.admin_token
        )
        if not success1:
            return False
        
        slug1 = response1.get('slug')
        post_id_1 = response1.get('id')
        
        # Create second post with same title
        success2, response2 = self.run_test(
            "POST /api/admin/blog/posts (second with same title)",
            "POST",
            "admin/blog/posts",
            200,
            data={
                "title": title,
                "excerpt": "Second post",
                "content_html": "<p>Second post content</p>",
                "category": "Тестування",
                "status": "draft"
            },
            token=self.admin_token
        )
        if not success2:
            return False
        
        slug2 = response2.get('slug')
        post_id_2 = response2.get('id')
        self.test_post_id_2 = post_id_2
        
        # Verify slugs are different
        if slug1 == slug2:
            self.log(f"ERROR: Slugs should be unique! Both are: {slug1}", "error")
            return False
        else:
            self.log(f"Slug uniqueness verified: '{slug1}' vs '{slug2}'", "info")
        
        return True

    def test_admin_blog_patch_title(self):
        """Test PATCH /api/admin/blog/posts/{id} (change title)"""
        if not self.admin_token or not self.test_post_id:
            self.log("Skipping - no admin token or test post", "error")
            return False
        
        success, response = self.run_test(
            "PATCH /api/admin/blog/posts/{id} (change title)",
            "PATCH",
            f"admin/blog/posts/{self.test_post_id}",
            200,
            data={"title": "Updated Test Post Title"},
            token=self.admin_token
        )
        if success:
            new_title = response.get('title')
            self.log(f"Title updated to: {new_title}", "info")
        return success

    def test_admin_blog_patch_status_to_published(self):
        """Test PATCH /api/admin/blog/posts/{id} (draft → published, verify published_at)"""
        if not self.admin_token or not self.test_post_id:
            self.log("Skipping - no admin token or test post", "error")
            return False
        
        success, response = self.run_test(
            "PATCH /api/admin/blog/posts/{id} (status: draft → published)",
            "PATCH",
            f"admin/blog/posts/{self.test_post_id}",
            200,
            data={"status": "published"},
            token=self.admin_token
        )
        if success:
            status = response.get('status')
            published_at = response.get('published_at')
            self.log(f"Status: {status}, published_at: {published_at}", "info")
            if status != 'published':
                self.log("ERROR: Status should be 'published'", "error")
                return False
            if not published_at:
                self.log("ERROR: published_at should be set when publishing", "error")
                return False
        return success

    def test_admin_blog_patch_toggle_hot(self):
        """Test PATCH /api/admin/blog/posts/{id} (toggle hot)"""
        if not self.admin_token or not self.test_post_id:
            self.log("Skipping - no admin token or test post", "error")
            return False
        
        success, response = self.run_test(
            "PATCH /api/admin/blog/posts/{id} (toggle hot=true)",
            "PATCH",
            f"admin/blog/posts/{self.test_post_id}",
            200,
            data={"hot": True},
            token=self.admin_token
        )
        if success:
            hot = response.get('hot')
            self.log(f"Hot flag: {hot}", "info")
            if not hot:
                self.log("ERROR: Hot should be True", "error")
                return False
        return success

    def test_admin_blog_patch_tags(self):
        """Test PATCH /api/admin/blog/posts/{id} (update tags)"""
        if not self.admin_token or not self.test_post_id:
            self.log("Skipping - no admin token or test post", "error")
            return False
        
        success, response = self.run_test(
            "PATCH /api/admin/blog/posts/{id} (update tags)",
            "PATCH",
            f"admin/blog/posts/{self.test_post_id}",
            200,
            data={"tags": ["updated", "tags", "test"]},
            token=self.admin_token
        )
        if success:
            tags = response.get('tags', [])
            self.log(f"Tags updated: {tags}", "info")
        return success

    def test_admin_blog_upload_image(self):
        """Test POST /api/admin/blog/upload-image (multipart file upload)"""
        if not self.admin_token:
            self.log("Skipping - no admin token", "error")
            return False
        
        # Create a small PNG image (1x1 red pixel)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        
        files = {'file': ('test.png', io.BytesIO(png_data), 'image/png')}
        
        success, response = self.run_test(
            "POST /api/admin/blog/upload-image (PNG)",
            "POST",
            "admin/blog/upload-image",
            200,
            files=files,
            token=self.admin_token
        )
        if success:
            url = response.get('url', '')
            filename = response.get('filename', '')
            self.log(f"Uploaded: {filename}, URL: {url}", "info")
            # Verify URL starts with /api/uploads/blog/
            if not url.startswith('/api/uploads/blog/'):
                self.log(f"ERROR: URL should start with /api/uploads/blog/, got: {url}", "error")
                return False
            # Verify file is publicly fetchable
            full_url = f"https://repo-deploy-55.preview.emergentagent.com{url}"
            try:
                fetch_response = requests.get(full_url, timeout=10)
                if fetch_response.status_code == 200:
                    self.log(f"File is publicly accessible at {url}", "info")
                else:
                    self.log(f"WARNING: File not accessible (status {fetch_response.status_code})", "error")
            except Exception as e:
                self.log(f"WARNING: Could not verify file accessibility: {e}", "error")
        return success

    def test_admin_blog_delete(self):
        """Test DELETE /api/admin/blog/posts/{id}"""
        if not self.admin_token or not self.test_post_id_2:
            self.log("Skipping - no admin token or test post", "error")
            return False
        
        success, response = self.run_test(
            f"DELETE /api/admin/blog/posts/{self.test_post_id_2}",
            "DELETE",
            f"admin/blog/posts/{self.test_post_id_2}",
            200,
            token=self.admin_token
        )
        if success:
            deleted = response.get('deleted', False)
            self.log(f"Deleted: {deleted}", "info")
            # Verify post is gone
            verify_success, _ = self.run_test(
                f"GET /api/admin/blog/posts/{self.test_post_id_2} (verify deleted)",
                "GET",
                f"admin/blog/posts/{self.test_post_id_2}",
                404,
                token=self.admin_token
            )
            if not verify_success:
                self.log("ERROR: Post should return 404 after deletion", "error")
                return False
        return success

    def test_admin_blog_delete_no_auth(self):
        """Test DELETE /api/admin/blog/posts/{id} without auth (should 401/403)"""
        if not self.test_post_id:
            self.log("Skipping - no test post", "error")
            return False
        
        success, _ = self.run_test(
            "DELETE /api/admin/blog/posts/{id} (no auth → 401)",
            "DELETE",
            f"admin/blog/posts/{self.test_post_id}",
            401
        )
        return success

    # ===== CONTACT MESSAGES =====
    def test_contact_message_create(self):
        """Test POST /api/contact-messages (with consent)"""
        success, response = self.run_test(
            "POST /api/contact-messages (valid)",
            "POST",
            "contact-messages",
            201,
            data={
                "name": "Test User",
                "email": "test@example.com",
                "message": "This is a test message from automated testing",
                "consent": True
            }
        )
        if success:
            msg_id = response.get('id')
            self.log(f"Contact message created: {msg_id}", "info")
        return success

    def test_contact_message_no_consent(self):
        """Test POST /api/contact-messages without consent (should 400)"""
        success, _ = self.run_test(
            "POST /api/contact-messages (no consent → 400)",
            "POST",
            "contact-messages",
            400,
            data={
                "name": "Test User",
                "email": "test@example.com",
                "message": "Test message",
                "consent": False
            }
        )
        return success

    def test_contact_message_invalid_email(self):
        """Test POST /api/contact-messages with invalid email (should 422)"""
        success, _ = self.run_test(
            "POST /api/contact-messages (invalid email → 422)",
            "POST",
            "contact-messages",
            422,
            data={
                "name": "Test User",
                "email": "not-an-email",
                "message": "Test message",
                "consent": True
            }
        )
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("\n" + "="*70)
        print("🚀 TAMIS АГРО Backend API Testing - Blog Feature")
        print("="*70 + "\n")

        # Auth
        print("\n🔐 ADMIN AUTH")
        print("-" * 70)
        if not self.test_admin_login():
            print("\n❌ Admin login failed - cannot proceed with admin tests")
            return 1

        # Public blog endpoints
        print("\n📰 PUBLIC BLOG ENDPOINTS")
        print("-" * 70)
        self.test_blog_posts_list()
        self.test_blog_posts_filter_category()
        self.test_blog_posts_filter_tag()
        self.test_blog_posts_search()
        self.test_blog_posts_sort_newest()
        self.test_blog_posts_sort_oldest()
        self.test_blog_posts_sort_popular()
        self.test_blog_post_detail()
        self.test_blog_post_detail_404()
        self.test_blog_post_related()
        self.test_blog_categories()
        self.test_blog_tags()

        # Admin blog endpoints
        print("\n🔒 ADMIN BLOG ENDPOINTS")
        print("-" * 70)
        self.test_admin_blog_list_no_auth()
        self.test_admin_blog_list()
        self.test_admin_blog_create()
        self.test_admin_blog_create_duplicate_title()
        self.test_admin_blog_patch_title()
        self.test_admin_blog_patch_status_to_published()
        self.test_admin_blog_patch_toggle_hot()
        self.test_admin_blog_patch_tags()
        self.test_admin_blog_upload_image()
        self.test_admin_blog_delete()
        self.test_admin_blog_delete_no_auth()

        # Contact messages
        print("\n📧 CONTACT MESSAGES")
        print("-" * 70)
        self.test_contact_message_create()
        self.test_contact_message_no_consent()
        self.test_contact_message_invalid_email()

        # Summary
        print("\n" + "="*70)
        print(f"📊 RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        print("="*70 + "\n")

        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = BlogAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())

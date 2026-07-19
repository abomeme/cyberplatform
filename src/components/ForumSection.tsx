import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, User, ChevronLeft, PlusCircle, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { ForumPost } from '../types';

interface ForumSectionProps {
  user: { name: string; role: string; points: number };
}

export default function ForumSection({ user }: ForumSectionProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('عام');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['الكل', 'نصائح عامة', 'حلول المعامل', 'ثغرات الويب', 'أساسيات لينكس', 'عام'];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/forum/posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory,
        }),
      });
      const data = await response.json();
      setPosts((prev) => [data, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setIsCreatingPost(false);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newReplyContent.trim()) return;

    try {
      const response = await fetch(`/api/forum/posts/${selectedPost.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newReplyContent }),
      });
      const updatedPost = await response.json();

      setSelectedPost(updatedPost);
      setNewReplyContent('');
      // Update in posts list
      setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    } catch (err) {
      console.error('Error creating reply:', err);
    }
  };

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, upvotes: p.upvotes + 1 };
        }
        return p;
      })
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }
  };

  const filteredPosts = selectedCategory === 'الكل'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 space-y-6" id="forum-section">
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black flex items-center space-x-2 space-x-reverse">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>منتدى مجتمع سايبر الأكاديمي (Cyber Forum)</span>
          </h2>
          <p className="text-xs text-slate-400">ناقش المعامل، تبادل الخبرات والتلميحات البرمجية مع زملائك ومساعدي التدريس.</p>
        </div>

        {!selectedPost && (
          <button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="flex items-center space-x-1.5 space-x-reverse bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 py-2 rounded text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>طرح سؤال أو موضوع جديد</span>
          </button>
        )}
      </div>

      {/* Selected Post Detail View */}
      {selectedPost ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center space-x-1 space-x-reverse text-xs font-bold text-emerald-400 hover:underline"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة لقائمة المواضيع</span>
          </button>

          {/* Core Post */}
          <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                  {selectedPost.category}
                </span>
                <span className="text-[10px] text-slate-500">
                  نشر في: {new Date(selectedPost.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <button
                onClick={(e) => handleUpvote(selectedPost.id, e)}
                className="flex items-center space-x-1 space-x-reverse text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-1 rounded hover:bg-emerald-950/40"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedPost.upvotes} تأييد</span>
              </button>
            </div>

            <h3 className="text-md font-bold text-slate-100">{selectedPost.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>

            <div className="flex items-center space-x-2 space-x-reverse border-t border-slate-900 pt-3 text-[10px] text-slate-500">
              <span className="font-bold text-slate-400">{selectedPost.author.name}</span>
              <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[9px]">{selectedPost.author.role}</span>
              <span>•</span>
              <span>رصيد الكاتب: {selectedPost.author.points} نقطة</span>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400">التعليقات والردود الأكاديمية ({selectedPost.replies.length}):</h4>

            <div className="space-y-3">
              {selectedPost.replies.map((rep) => (
                <div key={rep.id} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-lg space-y-2">
                  <p className="text-xs text-slate-300 leading-relaxed">{rep.content}</p>
                  <div className="flex items-center space-x-2 space-x-reverse text-[9px] text-slate-500 border-t border-slate-950/20 pt-2">
                    <span className="font-bold text-slate-400">{rep.author.name}</span>
                    <span className={`px-1 rounded ${
                      rep.author.role === 'Instructor' ? 'bg-amber-950 text-amber-400' :
                      rep.author.role === 'Teaching Assistant' ? 'bg-indigo-950 text-indigo-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {rep.author.role}
                    </span>
                    <span>•</span>
                    <span>{new Date(rep.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Write Reply Form */}
            {user.role === 'Guest' ? (
              <div className="bg-slate-950 p-4 border border-slate-800/80 rounded-lg text-center text-xs text-amber-400 font-sans mt-2">
                ⚠️ وضع الزائر مقيد: يرجى التسجيل أو تبديل دورك للمشاركة وكتابة ردود بالمنتدى.
              </div>
            ) : (
              <form onSubmit={handleCreateReply} className="flex gap-2 items-end pt-2">
                <textarea
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  placeholder="اكتب ردك الأكاديمي أو المساعدة هنا..."
                  rows={2}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-3 rounded-lg flex items-center justify-center transition-all shadow active:scale-95 shrink-0 h-10 w-10 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950 rotate-180" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] px-3 py-1 rounded-full font-bold border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-slate-950 border-emerald-600 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Write New Post Form (Toggled) */}
          {isCreatingPost && (
            user.role === 'Guest' ? (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 text-center space-y-3 font-sans">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-300">أنت تتصفح حالياً بوضع الزائر (Guest Mode). طرح الأسئلة بالمنتدى متاح فقط للطلاب المسجلين.</p>
                <p className="text-[10px] text-slate-500">استخدم "محاكي الصلاحيات والتحكم" بالترقية لـ Student لتفعيل النشر فوراً!</p>
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-bold text-emerald-400">كتابة موضوع جديد بالمنتدى</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="عنوان الموضوع بشكل واضح..."
                  className="md:col-span-2 bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-400 focus:outline-none"
                >
                  <option value="عام">تصنيف: عام</option>
                  <option value="نصائح عامة">تصنيف: نصائح عامة</option>
                  <option value="حلول المعامل">تصنيف: حلول المعامل</option>
                  <option value="ثغرات الويب">تصنيف: ثغرات الويب</option>
                  <option value="أساسيات لينكس">تصنيف: أساسيات لينكس</option>
                </select>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="اكتب تفاصيل استفسارك أو المقال الأمني هنا بالتفصيل ليتسنى للجميع فهمه وحله..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                required
              />

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded"
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-5 py-1.5 rounded font-bold"
                >
                  نشر الموضوع بالمنتدى
                </button>
              </div>
            </form>
          ))}

          {/* List of Posts */}
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 animate-pulse text-xs">جاري تحميل منشورات المنتدى...</div>
          ) : filteredPosts.length === 0 ? (
            <p className="text-center py-10 text-slate-500 text-xs">لا توجد مواضيع في هذا التصنيف حالياً. كن أول من ينشر موضوعاً!</p>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 p-4 rounded-lg flex items-start justify-between gap-4 cursor-pointer transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center space-x-1 space-x-reverse">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{post.category}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">
                        الكاتب: {post.author.name} ({post.author.role})
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200">{post.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">{post.content}</p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 pr-4">
                    <button
                      onClick={(e) => handleUpvote(post.id, e)}
                      className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-slate-900 text-emerald-400 transition-colors"
                      title="تصويت بالتأييد"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold mt-0.5">{post.upvotes}</span>
                    </button>

                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">{post.repliesCount} رد</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

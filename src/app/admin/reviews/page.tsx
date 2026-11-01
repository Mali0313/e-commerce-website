'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { getAllReviewsAdmin, toggleReviewApproval, deleteReview } from '@/lib/data/store';
import { Review } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AdminReviewsPage() {
  const { success } = useToast();
  const [reviews, setReviews] = useState<Review[]>(getAllReviewsAdmin());

  const handleToggle = (id: string) => {
    toggleReviewApproval(id);
    setReviews(getAllReviewsAdmin());
    success('Review visibility updated.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer review?')) {
      deleteReview(id);
      setReviews(getAllReviewsAdmin());
      success('Review deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Customer Reviews Moderation
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Approve, hide, or remove product feedback submitted by Pakistani shoppers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Comments</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{r.user_name || 'Customer'}</p>
                    <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-semibold">
                      Verified Buyer ✓
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex text-amber-500 items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="font-bold ml-1 text-gray-900">{r.rating}.0</span>
                    </div>
                  </td>

                  <td className="p-4 max-w-sm">
                    <p className="font-bold text-gray-900">{r.title || 'Product Feedback'}</p>
                    <p className="text-gray-600 line-clamp-2 mt-0.5">{r.comment}</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.is_approved
                          ? 'bg-orange-100 text-orange-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {r.is_approved ? 'Visible on Store' : 'Hidden / Under Review'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(r.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          r.is_approved
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {r.is_approved ? 'Hide Review' : 'Approve Review'}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// Query page for running custom SQL queries

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { acquireConnection, releaseConnection } from '../state/slices/profilesSlice';
import QueryEditor from '../components/QueryEditor';

export default function QueryPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector((state) =>
    state.profiles.list.find((p) => p.id === profileId)
  );

  useEffect(() => {
    if (!profileId) return;
    dispatch(acquireConnection(profileId));
    return () => {
      dispatch(releaseConnection(profileId));
    };
  }, [dispatch, profileId]);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Profile not found</div>
        <button onClick={() => navigate('/profiles')} className="btn-primary">
          Go to Profiles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Query Editor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Profile: <span className="font-medium">{profile.name}</span> •{' '}
          <span className="text-sm">{profile.dbPath}</span>
        </p>
        {profile.readOnly && (
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
            Read-only connection &mdash; mutating statements will be blocked.
          </p>
        )}
      </div>
      <div className="flex-1">
        <QueryEditor profileId={profileId!} isReadOnly={Boolean(profile.readOnly)} />
      </div>
    </div>
  );
}

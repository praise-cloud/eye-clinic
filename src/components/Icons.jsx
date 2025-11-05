import React from 'react'

export const EyeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

export const UsersIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

export const ChartIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export const DocumentIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export const ChatIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

export const InventoryIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01" />
  </svg>
)

export const AdminIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

export const ArrowRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

export const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
  </svg>
)

export const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export const LoadingIcon = ({ className = "w-8 h-8" }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export const UserPlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
)

export const LoginIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
)

export const DeleteIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 3.75H2.25M2.25 3.75H14.25M2.25 3.75V14.25C2.25 14.6478 2.40804 15.0294 2.68934 15.3107C2.97064 15.592 3.35218 15.75 3.75 15.75H11.25C11.6478 15.75 12.0294 15.592 12.3107 15.3107C12.592 15.0294 12.75 14.6478 12.75 14.25V3.75M4.5 3.75V2.25C4.5 1.85218 4.65804 1.47064 4.93934 1.18934C5.22064 0.908035 5.60218 0.75 6 0.75H9C9.39782 0.75 9.77936 0.908035 10.0607 1.18934C10.342 1.47064 10.5 1.85218 10.5 2.25V3.75M6 7.5V12M9 7.5V12" stroke="#FF7878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

export const EditIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.4593 2.3314H2.24096C1.84553 2.3314 1.4663 2.48848 1.18669 2.76809C0.907082 3.0477 0.75 3.42693 0.75 3.82235V14.259C0.75 14.6545 0.907082 15.0337 1.18669 15.3133C1.4663 15.5929 1.84553 15.75 2.24096 15.75H12.6776C13.0731 15.75 13.4523 15.5929 13.7319 15.3133C14.0115 15.0337 14.1686 14.6545 14.1686 14.259V9.0407M13.0504 1.21318C13.347 0.916611 13.7492 0.75 14.1686 0.75C14.588 0.75 14.9902 0.916611 15.2868 1.21318C15.5834 1.50975 15.75 1.91198 15.75 2.3314C15.75 2.75081 15.5834 3.15304 15.2868 3.44961L8.20478 10.5317L5.22287 11.2771L5.96835 8.29522L13.0504 1.21318Z" stroke="#28A54C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

export const ViewIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2506 0.75C16.7505 0.75 19.7512 6.75 19.7512 6.75C19.7512 6.75 16.7505 12.75 10.2506 12.75C3.75073 12.75 0.75 6.75 0.75 6.75C0.75 6.75 3.75073 0.75 10.2506 0.75Z" stroke="#39A1FF" strokeWidth="1.5" strokeLinejoin="round"/>
<path d="M13.0862 6.75C13.0949 7.13929 13.0257 7.5264 12.8828 7.8886C12.7398 8.2508 12.5259 8.58078 12.2537 8.85918C11.9814 9.13758 11.6563 9.35879 11.2974 9.50981C10.9385 9.66083 10.553 9.73863 10.1636 9.73863C9.77425 9.73863 9.38879 9.66083 9.02988 9.50981C8.67097 9.35879 8.34585 9.13758 8.0736 8.85918C7.80136 8.58078 7.58748 8.2508 7.44452 7.8886C7.30156 7.5264 7.2324 7.13929 7.24111 6.75C7.24111 5.9747 7.54909 5.23116 8.09731 4.68294C8.64553 4.13472 9.38908 3.82674 10.1644 3.82674C10.9397 3.82674 11.6832 4.13472 12.2314 4.68294C12.7797 5.23116 13.0876 5.9747 13.0876 6.75H13.0862Z" stroke="#39A1FF" strokeWidth="1.5" strokeLinejoin="round"/>
</svg>
)

export const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)
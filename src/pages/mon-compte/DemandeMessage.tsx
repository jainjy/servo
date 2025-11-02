import React from 'react'
import MessagesPage from '@/pages/AdminDiscussions'

// Wrapper page so /mon-compte/demandes/message shows the exact same message UI
export default function DemandeMessage() {
    return (
        <div className='mt-24'>
            <MessagesPage />
        </div>
    )
}

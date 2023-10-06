import * as React from 'react';

export const PageComponent = (page: any) => {

  const generateLikeListId = (): string => {
    return `likesList-${page.ID}`;
  }

  const listID = generateLikeListId();

  const showLikesList = (): void => {
    const likesList = document.getElementById(listID);
    likesList.style.display = likesList.style.display === 'none' ? 'grid' : 'none';
  }


  const userNameSpanStyle = {
    fontSize: '14px',
    border: '1px solid #cccccc',
    padding: '4px 6px',
    borderRadius: '2px',
    color: 'white',
    backgroundColor: 'rgb(76, 175, 80)'
  };


  const bannerUrl = page.BannerImageUrl ? page.BannerImageUrl.Url : '';

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"15px", width: '100%', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', padding: '16px', }}>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position:"relative" }}>
        <img src={bannerUrl} alt="Page Banner" style={{ width: '120px', height: '120px', borderRadius: '4px', objectFit: 'cover', marginRight: '16px' }} />
        <div style={{ flex: '1' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            {page.Title ? page.Title : ''}
          </h3>
          {page.FirstPublishedDate && <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            Published: {page.FirstPublishedDate}
          </p>
          }
          <button onClick={showLikesList} style={{ fontSize: '14px', padding: '8px 16px', color: 'black', border: '1px solid black', backgroundColor:"ghostwhite", cursor: 'pointer' }}>
            Likes: {page.likes ? page.likes.count : 0}
          </button>
        </div>
      </div>
      <div id={listID} style={{ width: "100%", display: 'none', marginTop: '8px', gap: "10px", gridTemplateColumns:"repeat(4,1fr)" }}>
        {page.likes && page.likes.likedBy && page.likes.likedBy.length > 0 && page.likes.likedBy.map((user: any) => {
          return (
            <span key={user.upn} style={userNameSpanStyle}>{user.name}</span>
          );
        }
        )}
      </div>
    </div>
  );
}

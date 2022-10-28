import Comments from './index'

export default {
  title: 'Comments',
  component: Comments,
  argTypes: {
    onSubmit: { action: 'submit' },
  }
}

const comments = [{
  "id": 2,
  "content": "a new comment",
  "createdAt": "Mon Oct 10 2022 12:53:55 GMT-0700 (Pacific Daylight Saving Time)",
  "updatedAt": "Mon Oct 10 2022 12:53:55 GMT-0700 (Pacific Daylight Saving Time)",
  "userId": "cl935xp470000m6q2jhxmm3xw",
  "postId": 3,
  "user": {
    "name": "Sam Meech-Ward",
    "image": "https://www.placecage.com/gif/284/196",
    "id": "cl935xp470000m6q2jhxmm3xw"
  }
},
{
  "id": 2,
  "content": "a new comment",
  "createdAt": "Mon Oct 10 2022 12:53:55 GMT-0700 (Pacific Daylight Saving Time)",
  "updatedAt": "Mon Oct 10 2022 12:53:55 GMT-0700 (Pacific Daylight Saving Time)",
  "userId": "cl935xp470000m6q2jhxmm3xw",
  "postId": 3,
  "user": {
    "name": "Sam Meech-Ward",
    "image": "https://www.placecage.com/gif/284/196",
    "id": "cl935xp470000m6q2jhxmm3xw"
  }
}]


export const Primary = (args) => <Comments
  className='max-w-2xl mx-auto px-6 my-6'
  comments={comments}
  {...args}
/>

import CommentForm from './index'

export default {
  title: 'CommentForm',
  component: CommentForm, 
  argTypes: {
    onSubmit: { action: 'submit' },
  }
}


export const Primary = (args) => <CommentForm className='max-w-2xl mx-auto' user={{image: "https://www.placecage.com/gif/284/196"}} {...args} />

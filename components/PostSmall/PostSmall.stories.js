import PostSmall from './index'

export default {
  title: 'PostSmall',
  component: PostSmall, 
  argTypes: {
    onSubmit: { action: 'submit' },
  }
}

const a = ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>


export const Primary = (args) => <PostSmall
Link={a}  
className='max-w-2xl mx-auto' 
href="#"
post={{
  title: "My first post",
  code: "const a = 1",
  language: "javascript",
  totalComments: 10,
  totalLikes: 10,
}} 
user={{
  name: "John Doe",
  image: "https://www.placecage.com/gif/284/196"
}}
{...args} 
/>


export const Liked = (args) => <PostSmall
Link={a}
className='max-w-2xl mx-auto' 
href="#"
post={{
  liked: true,
  title: "My first post",
  code: "const a = 1",
  
  totalComments: 10,
  totalLikes: 10,
}} 
user={{
  name: "John Doe",
  image: "https://www.placecage.com/gif/284/196"
}}
{...args} 
/>

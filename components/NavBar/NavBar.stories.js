import NavBar from './index'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default {
  title: 'NavBar',
  component: NavBar,
  argTypes: {
    selected: {
      options: ['None', 'Dashboard', 'Team', 'Projects', 'Calendar'],
      control: { type: 'radio' },
      defaultValue: 'None',
    },
    onSignIn: { action: 'sign in' },
    onSignOut: { action: 'sign out' },
  }
}

const navigation = [
  { name: 'Dashboard', href: '#dashboard', current: false },
  { name: 'Team', href: '#team', current: false },
  { name: 'Projects', href: '#projects', current: false },
  { name: 'Calendar', href: '#calendar', current: false },
]

const user = {
  name: 'Tom Cook',
  image: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZHxlbnwwfDB8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
}

const a = ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>

const Template = (args) => (
  <NavBar
    Link={a}
    Image={Image}
    navigation={navigation.map(n => ({ ...n, current: n.name === args.selected }))}
    {...args}
  />
)

export const SignedOut = Template.bind({})

export const SignedIn = Template.bind({})
SignedIn.args = { ...Template.args, user }

export const Icon = (args) => (
  <Template {...args} navigation={[{ ...navigation[0], Icon: PlusCircleIcon, current: false }, ...navigation.splice(1)].map(n => ({ ...n, current: n.name === args.selected })) } />
)


import { render, screen } from '@testing-library/react'

import Todo from './Todo'

test('renders content', () => {

    const mockDeleteButton = vi.fn()
    const mockCompleteButton = vi.fn()

    const todo = {
        text: 'Test the todo component',
        done: false
    }

    render(<Todo todo={todo} onClickDelete={mockDeleteButton} onClickComplete={mockCompleteButton} />)

    const elementOne = screen.getByText('Test the todo component')
    expect(elementOne).toBeDefined()

    const elementTwo = screen.getByText('This todo is not done')
    expect(elementTwo).toBeDefined()
})
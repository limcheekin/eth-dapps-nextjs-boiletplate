import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

// REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
export function useInput(isReadOnly: boolean) {
    const [value, setValue] = useState('')
    const input = <Input value={value} isReadOnly={isReadOnly} onChange={e => setValue(e.target.value)} />
    return [value, input]
}

export function useButton(onClickHandler, label: string) {
    const [loading, setLoading] = useState(false)
    const button = <Button isFullWidth isLoading={loading}
        spinner={<BeatLoader size={8} color="grey" />}
        onClick={async () => { setLoading(true); await onClickHandler(); setLoading(false) }}>{label}</Button>
    return [loading, button]
}
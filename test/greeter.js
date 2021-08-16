const Greeter = artifacts.require("Greeter")

contract('Greeter', (accounts) => {
  before(async () => {
    this.greeter = await Greeter.deployed()
  })

  it('deployed successfully', async () => {
    const address = await this.greeter.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('initiated properly', async () => {
    assert.equal(await this.greeter.greeting(), 'Hello, ')
  })

  it('updated greeting', async () => {
    const greeting = 'Hi, '
    await this.greeter.setGreeting(greeting)
    assert.equal(await this.greeter.greeting(), greeting)
  })

  it('greet, say hi', async () => {
    const greeting = 'Hi, '
    const name = 'Chee Kin'
    assert.equal(await this.greeter.greet(name), greeting + name)
  })
})


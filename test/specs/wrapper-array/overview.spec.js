import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'vue-template-compiler'
import 'packages/test-utils/src'

describeWithShallowAndMount('overview', mountingMethod => {
  it('throws error if wrapper array contains no items', () => {
    const wrapper = mountingMethod(compileToFunctions('<div />'))
    const message = '[vue-test-utils]: overview() cannot be called on 0 items'

    expect(() => wrapper.findAll('p').overview()).toThrow(message)
  })

  it('throws error when called on a WrapperArray', () => {
    const wrapper = mountingMethod(compileToFunctions('<div><div /></div>'))
    const message =
      '[vue-test-utils]: overview() must be called on a single wrapper, use at(i) to access a wrapper'

    expect(() => wrapper.findAll('div').overview()).toThrow(message)
  })
})

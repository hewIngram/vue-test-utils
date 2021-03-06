import { renderToString } from 'packages/server-test-utils/src'
import { createLocalVue } from 'packages/test-utils/src'
import ComponentWithChild from '~resources/components/component-with-child.vue'
import { describeDoNotRunIf } from 'conditional-specs'

describe('renderToString', () => {
  it.todo('placeholder')
  describeDoNotRunIf(process.env.TEST_ENV !== 'node', 'renderToString', () => {
    it('returns a promise', async () => {
      const str = await renderToString({
        template: `<div>{{this.val}}</div>`,
        data() {
          return { val: '123' }
        }
      })
      expect(str).toContain('123')
    })

    it('mounts functional component with a defined context when no context object passed in options', async () => {
      const defaultValue = '[vue-test-utils]: testProp default value'
      const Component = {
        functional: true,
        props: {
          testProp: {
            type: String,
            default: defaultValue
          }
        },
        render: (h, { props }) => h('div', props.testProp)
      }
      const str = await renderToString(Component)
      expect(str).toContain(defaultValue)
    })

    it('mounts component using passed localVue as base Vue', async () => {
      const TestComponent = {
        template: `<div>{{test}}</div>`
      }
      const localVue = createLocalVue()
      localVue.prototype.test = 'some value'
      const str = await renderToString(TestComponent, {
        localVue: localVue
      })
      expect(str).toContain('some value')
    })

    it('adds variables to vm when passed', async () => {
      const TestComponent = {
        template: `
          <div>
            {{$store.store}}
            {{$route.path}}
          </div>
        `
      }
      const $store = { store: true }
      const $route = { path: 'http://test.com' }
      const str = await renderToString(TestComponent, {
        mocks: {
          $store,
          $route
        }
      })
      expect(str).toContain('true')
      expect(str).toContain('http://test.com')
    })

    it('mounts component with $parent set to options.parentComponent', async () => {
      const Parent = {
        data: () => ({
          customName: 'Parent Name'
        })
      }
      const TestComponent = {
        template: '<div>{{$parent.customName}}</div>'
      }
      const str = await renderToString(TestComponent, {
        parentComponent: Parent
      })
      expect(str).toContain('Parent Name')
    })

    it('replaces component with template string ', async () => {
      const str = await renderToString(ComponentWithChild, {
        stubs: {
          ChildComponent: '<div class="stub"></div>'
        }
      })

      expect(str).toContain('"stub"')
    })
  })
})

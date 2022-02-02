import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  const wrapper = shallowMount(App)
  it('Renders without issues', () => {
    expect(wrapper.find('.App').exists()).to.be.true
  })

  let app = wrapper.get('.App')

  describe('App-status', () => {
    let appStatus
    it('Should exist', () => {
      appStatus = app.find('.App-status')
      expect(appStatus.exists()).to.be.true
    })

    it('Should go to closed, when starting without server', () => {
      expect(appStatus.classes()).to.contain('closed')
    })
  })
})

require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe "/maps" do
  before(:each) do
    @response = request("/maps")
  end
end
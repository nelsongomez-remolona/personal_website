require 'test_helper'

class MainControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get main_index_url
    assert_response :success
  end

  test "should get case1" do
    get main_case1_url
    assert_response :success
  end

  test "should get case2" do
    get main_case2_url
    assert_response :success
  end

  test "should get case3" do
    get main_case3_url
    assert_response :success
  end

  test "should get case4" do
    get main_case4_url
    assert_response :success
  end

end
